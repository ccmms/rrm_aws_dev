using rrm_reborn.backend;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddSingleton<IClickTracker, ClickTracker>();

var app = builder.Build();
app.UseHttpsRedirection();                          // enforcing https use

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/", () => "Hello World!");
app.Run();