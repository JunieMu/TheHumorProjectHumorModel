The goal is to create a prompt chain tool that can:

- Create new humor flavors

- Create new steps for humor flavors

- Edit steps for humor flavors

- Reorder the steps of the humor flavor

- Generate captions using an image test set


Use our REST API (api.almostcrackd.ai) to create captions using a given humor flavor in your prompt chain tool (instructions listed on line 59)


A humor flavor is a set of steps that run in specific order to create captions from an input image.


An example of a set of steps could be:

- Take in an image and output a description it in text.

- Take output from step 1 and output something funny about it.

- Take the output from step 2 and output five short, funny captions.


You’ll want to design an interface that can:

- create a humor flavor

- update a humor flavor

- delete a humor flavor

- create a humor flavor step

- update a humor flavor step

- delete a humor flavor step

- reorder a humor flavor step (move step 2 to step 1, etc)

- read the captions produced by a specific humor flavor

- support dark mode / light mode / system default mode

- test a humor flavor by generating captions using the REST API


Instructions for the assistant keep in mind: 
- I want a vintage looking app (washed colors (creams, blues, greens, yellows, pinks), plaid patterns, etc.). Make sure to keep the UI consistent with this and consistent with vintage typewriter fonts.
- The schema for the supabase data is located in schema.sql. Make sure to consult this.
- The environment variables to help connect to the supabase are located in .env.local. Use the given variable names throughout the application.
- this will be a web application made with NextJS, TailwindCSS, and Supabase which I will deploy on Vercel
- Keep a running log of the prompts given and your updates in a prompts_log.txt file.
- I don't want to add any new tables to the supabase.


How to Call the Caption Pipeline API

Use this base URL for all API calls: https://api.almostcrackd.ai


You will make requests in this order:

    Generate a presigned upload URL

    Upload image bytes to that presigned URL

    Register the uploaded image URL with the pipeline

    Generate captions from the registered image

Requirements

    A valid JWT access token

    Include auth header on API routes:

    Authorization: Bearer <your-token>

Supported image content types:

image/jpeg, image/jpg, image/png, image/webp, image/gif, image/heic


Step 1: Generate Presigned URL

Request

POST https://api.almostcrackd.ai/pipeline/generate-presigned-url


Headers:


Authorization: Bearer <your-token>
Content-Type: application/json

Body:


{
  "contentType": "image/jpeg"
}

Response

{
  "presignedUrl": "https://....",
  "cdnUrl": "https://presigned-url-uploads.almostcrackd.ai/<userId>/<filename>.jpg"
}


presignedUrl: direct upload target (S3 signed URL)

cdnUrl: public URL of the uploaded image (used in Step 3)


Step 2: Upload Image Bytes to presignedUrl

This is a PUT request directly to the returned presignedUrl (not to api.almostcrackd.ai).


await fetch(presignedUrl, {
  method: "PUT",
  headers: {
    "Content-Type": file.type
  },
  body: file
});

Important: Content-Type should match what you sent in Step 1.


Step 3: Register Image URL in the Pipeline

Request

POST https://api.almostcrackd.ai/pipeline/upload-image-from-url


Headers:


Authorization: Bearer <your-token>
Content-Type: application/json

Body:


{
  "imageUrl": "<cdnUrl from Step 1>",
  "isCommonUse": false
}

Response

{
  "imageId": "uuid-value",
  "now": 1738690000000
}

Save imageId for the caption step.


Step 4: Generate Captions

Request

POST https://api.almostcrackd.ai/pipeline/generate-captions


Headers:


Authorization: Bearer <your-token>
Content-Type: application/json

Body:


{
  "imageId": "uuid-value-from-step-3"
}

Response

Returns an array of caption records generated and saved by the system.


Captions for Specific Flavor

To generate captions for one humor flavor, call POST /pipeline/generate-captions and include humorFlavorId in the JSON body.


curl -X POST https://api.almostcrackd.ai/pipeline/generate-captions

-H “Authorization: Bearer <SUPABASE_JWT>”

-H “Content-Type: application/json”

-d ‘{

“imageId”: “”,

“humorFlavorId”:

}’