# nobul-services
Web services for GCP App Engine

The functionality of these services include:
  - API Endpoints for the app to consume and interact with the Postgres database.
  - REST endpoints to issue requests to 3rd party APIs

## Java Development
Recommend to use Spring Tools IDE https://spring.io/tools . It's a fork of Eclipse, with built in tools to run projects. Add GCP integrations from Eclipse Marketplace and connect to deploy to GCP App Engine.

Need application.properties files for each service, will have to get a way to chare database connection details.  See Ross for application.properties file and GCP SQL connection details. 

## Node JS Development
Google App engine currently supports nodeJS runtime version 8.