FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /src

COPY Rides.sln ./
COPY Rides.Api/*.csproj ./Rides.Api/
COPY Rides.Clients/*.csproj ./Rides.Clients/
COPY Rides.Data/*.csproj ./Rides.Data/

RUN dotnet restore

COPY . .
RUN dotnet publish Rides.Api/Rides.Api.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /src/out .
ENTRYPOINT ["dotnet", "Rides.Api.dll"]