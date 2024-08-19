using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DTO;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class PayPalManager
    {
        private readonly PayPalSettings payPalSettings;

        public PayPalManager(IConfiguration configuration)
        {
            payPalSettings = new PayPalSettings
            {
                ClientId = configuration["PaypalSettings:ClientId"],
                Secret = configuration["PaypalSettings:ClientSecret"],
                Url = configuration["PaypalSettings:Url"]
            };
        }

        public async Task<string> GetPaypalToken()
        {
            var token = "";

            string url = payPalSettings.Url + "/v1/oauth2/token";

            Console.WriteLine("URL utilizada para la solicitud: " + url);

            using (var client = new HttpClient())
            {
                string credentials64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(payPalSettings.ClientId + ":" + payPalSettings.Secret));
                client.DefaultRequestHeaders.Add("Authorization", "Basic " + credentials64);

                var requestMessage = new HttpRequestMessage(System.Net.Http.HttpMethod.Post, url);
                requestMessage.Content = new StringContent("grant_type=client_credentials", null, "application/x-www-form-urlencoded");

                var httpResponse = await client.SendAsync(requestMessage);
                if (httpResponse.IsSuccessStatusCode)
                {
                    var stringResponse = await httpResponse.Content.ReadAsStringAsync();

                    var jsonResponse = JsonNode.Parse(stringResponse);

                    if (jsonResponse != null)
                    {
                        token = jsonResponse["access_token"]?.ToString() ?? "";
                    }
                }
            }

            return token;
        }


        public async Task<string> CreateOrder(PayPalJson json)
        {
            using (var client = new HttpClient())
            {
                string accessToken = await GetPaypalToken();
                string url = payPalSettings.Url + "/v2/checkout/orders";  
                var stringJson = JsonConvert.SerializeObject(json);

                // Aqui van headers de curl
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                //Hago el contenido para el post
                var content = new StringContent(stringJson, Encoding.UTF8, "application/json");

                try
                {
                    // Mando el post con el contenidp
                    HttpResponseMessage response = await client.PostAsync(url, content);
                    // Verifico estado de respuesta
                    response.EnsureSuccessStatusCode();

                    // Leer y devolver el cuerpo de la respuesta
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var jsonResponse = JsonNode.Parse(responseBody);

                    if (jsonResponse != null)
                    {
                        var orderid = jsonResponse["id"]?.ToString() ?? "";
                        return orderid;
                    }
                    else {
                        return "Error creating order";
                    }
                }
                catch (HttpRequestException ex)
                {
                    Console.WriteLine($"Request error: {ex.Message}");
                    return "Error en la solicitud: " + ex.Message;
                }
            }
        }

        public async Task<string> CompleteOrder(string orderId)
        {
            using (var client = new HttpClient())
            {
                string accessToken = await GetPaypalToken();
                string url = payPalSettings.Url + "/v2/checkout/orders/" + orderId + "/capture";
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var content = new StringContent("", null, "application/json");

                var httpResponse = await client.PostAsync(url, content);

                if (httpResponse.IsSuccessStatusCode)
                {
                    var strResponse = await httpResponse.Content.ReadAsStringAsync();
                    using (var jsonDoc = JsonDocument.Parse(strResponse))
                    {
                        var root = jsonDoc.RootElement;
                        if (root.TryGetProperty("status", out JsonElement statusElement))
                        {
                            return statusElement.GetString();
                        }
                        else
                        {
                            return "status property not found";
                        }
                    }
                }
                else
                {
                    return "try again no funka";
                }
            }
        }

    }
}


