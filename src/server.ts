import express from 'express';
import bodyParser from 'body-parser';
import fs, { ReadStream } from 'fs';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get('/filteredimage', async (req, res) => {
    let image_url: string = req.query.image_url;
    if (!image_url) res.status(422).send('image_url not set!');

    filterImageFromURL(image_url)
      .then((output_image_url: string) => {
        let stream: ReadStream = fs.createReadStream(output_image_url);
        stream.once("end", function () {
          stream.destroy(); // makesure stream closed, not close if download aborted.
          deleteLocalFiles([output_image_url]);
        }).pipe(res);
      })
      .catch((err) => {
        res.status(422).send(err.message || "Bad request");
      })
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();