using dixit_backend.Manager;
using dixit_backend.Model;
using dixit_backend.Models.Actions.Payload;
using Microsoft.AspNetCore.Mvc;

var CorsAllowSpecificOrigin = "_corsAllowSpecificOrigin";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(p => p.AddPolicy(CorsAllowSpecificOrigin, builder =>
{
    builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// gamestate endpoints
app.MapGet("/serverstate", () =>
{
    return GameManager.GetServerState();
});

// players endpoints
app.MapPost("/players", ([FromBody] Player player) =>
{
    return GameManager.PlayerJoin(player);
});

app.MapPost("/players/{playerId}/actions/submit-text", (string playerId, SubmitTextPayload payload) =>
{
    return GameManager.PlayerActionSubmitText(playerId, payload);
});

app.MapPost("/players/{playerId}/actions/submit-image", (string playerId, SubmitImagePayload payload) =>
{
    return GameManager.PlayerActionSubmitImage(playerId, payload);
});

app.MapPost("/players/{playerId}/actions/submit-vote", (string playerId, SubmitVotePayload payload) =>
{
    return GameManager.PlayerActionSubmitVote(playerId, payload);
});

app.MapPost("/players/{playerId}/actions/next-round", (string playerId) =>
{
    GameManager.PlayerActionNextRound(playerId);
});

// restart endpoint
app.MapPost("/restart", () =>
{
    GameManager.Restart();
});

app.UseCors(CorsAllowSpecificOrigin);

app.Run();