export function loadProgressHandler(loader, resource) {

  // Display the file 'url' currently being loaded
  console.log("Loading: " + resource.url);

  // Display the precentage of files currently loaded
  console.log("Progress: " + loader.progress + "%");
}