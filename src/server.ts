import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

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

     app.get( "/filteredimage/", async ( req: Request, res: Response ) => { // added async to await for the outpath
      let { image_url } = req.query;    // getting the query parameter

      if ( !image_url ) {               // Checking to see if the parameter is set
        return res.status(400)          // Return 400
                  .send(`image_url is a required query parameter`);
      }
      var urlExists = require('url-exists');
            urlExists(image_url, async function(err: any, exists: boolean) {
        if(exists)
        {
          const filteredpath = filterImageFromURL(image_url);    // Call the filterimagefromURL function from UTIL and geting the outpath back
          let fileArr = [await filteredpath];
          return res.status(200).sendFile((await filteredpath).toString(), async () => {
             await deleteLocalFiles(fileArr);  // Async remove file afterwards
         });
        }
        else
        {
          return res.status(400)       //  Return 400
          .send(`url can't be reached! `+image_url);
        }
      });
      
   /*   const filteredpath = filterImageFromURL(image_url);    // Call the filterimagefromURL function from UTIL and geting the outpath back
      let fileArr = [await filteredpath];
      return res.status(200).sendFile((await filteredpath).toString(), async () => {
        await deleteLocalFiles(fileArr);  // Async remove file afterwards
      });*/

    } );

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();