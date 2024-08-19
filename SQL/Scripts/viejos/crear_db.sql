-- =============================================
-- Create database template
-- =============================================
USE master
GO

-- Drop the database if it already exists
IF  EXISTS (
  SELECT name 
    FROM sys.databases 
    WHERE name = N'PhoenixFitness'
)
DROP DATABASE PhoenixFitness
GO

CREATE DATABASE PhoenixFitness
GO