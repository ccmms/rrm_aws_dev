using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using rrm_reborn.backend;
using System.Security.Claims;

JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddSingleton<IClickTracker, ClickTracker>();

var allowedOrigins = builder.Configuration.GetSection("Cors:FrontendOrigins").Get<string[]>()
                      ?? ["http://localhost:5173"];
var cognitoRegion = builder.Configuration["Cognito:Region"];
var cognitoUserPoolId = builder.Configuration["Cognito:UserPoolId"];
var cognitoClientId = builder.Configuration["Cognito:ClientId"];
var cognitoAuthority = $"https://cognito-idp.{cognitoRegion}.amazonaws.com/{cognitoUserPoolId}";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendOrigin", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.Authority = cognitoAuthority;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = cognitoAuthority,
        ValidateAudience = true,
        ValidAudience = cognitoClientId,
        ValidateLifetime = true
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();
app.UseHttpsRedirection();
app.UseCors("AllowFrontendOrigin");             
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/api/me", (ClaimsPrincipal user, IClickTracker tracker) =>
{
    var sub = user.FindFirst("sub")?.Value;
    if (sub is null)
    {
        return Results.Unauthorized();
    }
    return Results.Ok(new { totalClicks = tracker.GetTotal(sub) });

}).RequireAuthorization(); ;


app.MapPost("/api/clicks", (ClaimsPrincipal user, IClickTracker tracker) =>
{
    var sub = user.FindFirst("sub")?.Value;
    if (sub is null)
    {
        return Results.Unauthorized();
    }
    return Results.Ok(new { totalClicks = tracker.RegisterClick(sub) });

}).RequireAuthorization();


app.MapPost("/api/logout", (ClaimsPrincipal user, IClickTracker tracker) =>
{
    var sub = user.FindFirst("sub")?.Value;
    if (sub is null)
    {
        return Results.Unauthorized();
    }
    return Results.Ok(new { totalClicks = tracker.EndSession(sub) });

}).RequireAuthorization();

app.Run();