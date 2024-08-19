using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;
using dotenv.net;
using Microsoft.AspNetCore.Cors;

namespace API.Controllers
{
    [EnableCors("corspolicy")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CloudinaryUploadController : Controller
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryUploadController(Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.FileName, stream)
                };
                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return Ok(new { uploadResult.Url });
                }
                else
                {
                    return BadRequest(uploadResult.Error.Message);
                }
            }
            return BadRequest("Invalid file");
        }



    }
}

