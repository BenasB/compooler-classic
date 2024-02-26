FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /src

COPY GroupMaker.sln ./
COPY GroupMaker.Api/*.csproj ./GroupMaker.Api/
COPY GroupMaker.Data/*.csproj ./GroupMaker.Data/

RUN dotnet restore

COPY . .
RUN dotnet publish GroupMaker.Api/GroupMaker.Api.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /src/out .
ENTRYPOINT ["dotnet", "GroupMaker.Api.dll"]