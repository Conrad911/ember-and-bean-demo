// Ember & Bean Coffee House - demo site host.
// Serves the static website in wwwroot (index.html by default). No backend logic.
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();
