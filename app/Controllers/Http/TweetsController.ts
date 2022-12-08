// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import User from "App/Models/User";
import TwitterAccount from "App/Models/TwitterAccount";
import Tweets from "App/Models/Tweet";
import axios from 'axios';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DocDB, FSx } from 'aws-sdk';

export default class TweetsController {
    public async index({ view, request, response, auth }: HttpContextContract) {
      const page = request.input('page', 1)
      const limit = 5
        const tweets = await Tweets.query().paginate(page, limit);
        console.log(tweets);
        return view.render('welcome', { tweets })
    }

    public async screenshotSpecific({ params, request, response, auth }: HttpContextContract) {
        if(params.url) {
          const puppeteer = require("puppeteer");
          const fs = require('fs');
          const chromium = require('chromium');
          let id = decodeURIComponent(params.url).split('/')[5];
          let accountName = decodeURIComponent(params.url).split('/')[3];

          if (params.url) {
            let newUrl = decodeURIComponent(params.url)
            const s3Client = new S3Client({
              endpoint: "https://fra1.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
              forcePathStyle: false,
              region: "eu-central-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
              credentials: {
                accessKeyId: "DO00JHEMD7PK3X6URUZW", // Access key pair. You can create access key pairs using the control panel or API.
                secretAccessKey: "3bP61YOMnpb/HDtMChuTTa2AHlwYuYYr+hrAAVBFJ34" // Secret access key defined through an environment variable.
              }
            });
          
            const uploadObject = async () => {
              const screenshotParams = {
                Bucket: "tweetwatch", // The path to the directory you want to upload the object to, starting with your Space name.
                Key: `${accountName}/${id}.jpg`, // Object key, referenced whenever you want to access this file later.
                // Body: "Hello World!", // The file contents.
                // the body is the image data
                Body: fs.createReadStream(await puppeteer.launch({
                  defaultViewport: {
                    width: 3840,
                    height: 2160,
                  },
                  executablePath: chromium.path,
                  headless: 'chrome',
                }).then(async (browser) => {
                  const page = await browser.newPage();
                  await page.goto(newUrl, { waitUntil: 'networkidle0' });
                  await page.screenshot({
                    filename: accountName + "-" + id + ".jpg",
                    path: './public/tweets/' + accountName + "-" + id + ".jpg",
                    clip: {
                      x: 1550,
                      y: 0,
                      width: 640,
                      height: 1080
                    }
                  });
                  await browser.close();
                  return `./public/tweets/${accountName}-${id}.jpg`
                })),
                ContentType: 'image/jpg',
                ContentEncoding: 'base64',
                ACL: "public-read", // Defines ACL permissions, such as private or public.
                Metadata: { // Defines metadata tags.
                  "user": "testUser",
                  "account": "realElonMusk"
                }
              };
  
              try {
                const data = await s3Client.send(new PutObjectCommand(screenshotParams));
                console.log(
                  "Successfully uploaded object: " +
                  screenshotParams.Bucket +
                    "/" +
                    screenshotParams.Key
                );
                return data;
              } catch (err) {
                console.log("Error", err);
              }
            };

            uploadObject();

            await Tweets.create({
              twitterAccountId: 0,
              tweet: `${accountName}/${id}.jpg`
            })
          }
          else {
            response.status(204)
          }
        }
        else {
          response.status(401);
        }
      }
}
