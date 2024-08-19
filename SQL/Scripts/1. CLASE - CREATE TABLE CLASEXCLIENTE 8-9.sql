USE PhoenixFitness;
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TClaseXCliente](
	[idInscripcion] [int] IDENTITY(1,1) NOT NULL,
	[idClase] [int] NOT NULL,
	[idCliente] [nvarchar](25) NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[TClaseXCliente] ADD  CONSTRAINT [PK_TClaseXCliente] PRIMARY KEY CLUSTERED 
(
	[idInscripcion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[TClaseXCliente]  WITH CHECK ADD  CONSTRAINT [FK_TClaseXCliente_TClase] FOREIGN KEY([idClase])
REFERENCES [dbo].[TClase] ([idClase])
GO
ALTER TABLE [dbo].[TClaseXCliente] CHECK CONSTRAINT [FK_TClaseXCliente_TClase]
GO
ALTER TABLE [dbo].[TClaseXCliente]  WITH CHECK ADD  CONSTRAINT [FK_TClaseXCliente_TUsuario] FOREIGN KEY([idCliente])
REFERENCES [dbo].[TUsuario] ([cedula])
GO
ALTER TABLE [dbo].[TClaseXCliente] CHECK CONSTRAINT [FK_TClaseXCliente_TUsuario]
GO
