using rrm_reborn.backend;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddSingleton<IClickTracker, ClickTracker>();

var allowedOrigins = builder.Configuration.GetSection("Cors:FrontendOrigins").Get<string[]>()
                      ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendOrigin", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseHttpsRedirection();
app.UseCors("AllowFrontendOrigin");// enforcing https use

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => "Hello World!");
app.MapGet("/api/me", (string userId, IClickTracker tracker) => Results.Ok(new { totalClicks = tracker.GetTotal(userId) }));
app.MapPost("/api/clicks", (string userId, IClickTracker tracker) => Results.Ok(new { totalClicks = tracker.RegisterClick(userId) }));
app.MapPost("/api/logout", (string userId, IClickTracker tracker) => Results.Ok(new { totalClicks = tracker.EndSession(userId) }));
app.Run();