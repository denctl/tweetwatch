// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import User from "App/Models/User";
import TwitterAccounts from "App/Models/TwitterAccount";
import Tweets from "App/Models/Tweet";

export default class TweetsController {
    public async app({ view, request, response, auth }: HttpContextContract) {
      const page = request.input('page', 1)
      const limit = 5
      const user = auth.user;

      if(user) {
        const accounts = await TwitterAccounts.query().where('username', user.username).paginate(page, limit);
        const tweets = await Tweets.query().where('username', user.username);
        accounts.baseUrl('/app')
        return view.render('app', { accounts, tweets })
      }
      else {
        return response.redirect().toRoute('auth.login.show')
      }
    }

    public async tweets({ params, view, request, response, auth }: HttpContextContract) {
      let user = auth.user;
      if(user) {
        const tweets = await Tweets.query().where('username', user.username).where('account', params.account);
        return view.render('tweets', { tweets })
      }
    }

    public async addAccount({ request, response, auth }: HttpContextContract) {
      if(auth.user) {
        const accountAdd = schema.create({
          account: schema.string(),
          category: schema.string(),
        })
        
        const data = await request.validate({ schema: accountAdd })
        await TwitterAccounts.create({
          username: auth.user.username,
          account: data.account,
          category: data.category
        }) 
        return response.redirect().back();
      }
    }

    public async deleteAccount({ params, request, response, auth }: HttpContextContract) {
      const user = auth.user;

      if(user) {
        await TwitterAccounts.query().where('account', params.accountName).where('username', user.username).delete()
      }
    }

    public async dashboard({ request, response, auth, session, view }: HttpContextContract) {
      // grab uid and password values off request body
      const user = auth.user;

      if (user) {
        return view.render('dashboard')
      }
      else {
        return response.redirect().toRoute('auth.login.show')
      }
    }

    public async settings({ request, response, auth, session, view }: HttpContextContract) {
      // grab uid and password values off request body
      const user = auth.user;

      if (user) {
        return view.render('settings')
      }
      else {
        return response.redirect().toRoute('auth.login.show')
      }
    }

    public async singleTweet({ request, response, auth, session, view }: HttpContextContract) {
      // grab uid and password values off request body
      const user = auth.user;

      if (user) {
        return view.render('single-tweet')
      }
      else {
        return response.redirect().toRoute('auth.login.show')
      }
    }

    public async screenshot({ params, response }: HttpContextContract) {
      if(params.username) {
        const puppeteer = require("puppeteer");
        const axios = require('axios');
        const chromium = require('chromium');
        const token = "AAAAAAAAAAAAAAAAAAAAAMJhbQEAAAAAWvwo3qwlN5D1pWpKl%2BNi98bGtDM%3DzYCPTQAGKL6CjTo3ceQA1Hw5vNmRnmUzZbsZHwPgOEjTOxzl6B"
        let responseTweet = await axios.get(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${params.username}&count=1/users`, { headers: {"Authorization" : `Bearer ${token}`} }).then(res => {
            return res.data[0].id_str
          })
          .catch(error => {
            console.error(error);
        });
        let screenshotFile = `./public/tweets/${params.username}-${responseTweet}.jpg`

        if (responseTweet) {
          puppeteer
          .launch({
            defaultViewport: {
              width: 3840,
              height: 2160,
            },
            executablePath: chromium.path,
            headless: 'chrome',
          })
          .then(async (browser) => {
            const page = await browser.newPage();
            await page.goto(`https://twitter.com/${params.username}/status/${responseTweet}`, { waitUntil: 'networkidle0' });
            await page.screenshot({ 
              path: screenshotFile,
              clip: {
                x: 1550,
                y: 0,
                width: 640,
                height: 1080
              }
            });
            await browser.close();
          });
          response.status(203)
           
        }
        else {
          response.status(204)
        }
      }
      else {
        response.status(401);
      }
    }

    public async screenshotSpecific({ params, request, response, auth }: HttpContextContract) {
      const user = auth.user;

      if(user) {
        if(params.url) {
          const puppeteer = require("puppeteer");
          const chromium = require('chromium');
          let id = decodeURIComponent(params.url).split('/')[5];
          let accountName = decodeURIComponent(params.url).split('/')[3];
          let screenshotFile = `./public/tweets/${accountName}-${id}.jpg`

          if (params.url) {
            let newUrl = decodeURIComponent(params.url)
            puppeteer
            .launch({
              defaultViewport: {
                width: 3840,
                height: 2160,
              },
              executablePath: chromium.path,
              headless: 'chrome',
            })
            .then(async (browser) => {
              const page = await browser.newPage();
              await page.goto(`${newUrl}`, { waitUntil: 'networkidle0' });
              await page.screenshot({ 
                path: screenshotFile,
                clip: {
                  x: 1550,
                  y: 0,
                  width: 640,
                  height: 1080
                }
              });
              await browser.close();
            });
            response.status(203)

            await Tweets.create({
              account: accountName,
              username: user.username,
              tweet: `/tweets/${accountName}-${id}.jpg`
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

    // GET LATEST TWEET
    // "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + username + '&count=1/users';
    
    // NAME THE FILE
    // "./public/tweets/" + encodeURIComponent(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=1/users` + '.jpg')

    // SCREENSHOT CONFIGURATION
    // puppeteer
    //   .launch({
    //     defaultViewport: {
    //       width: 3840,
    //       height: 2160,
    //     },
    //   })
    //   .then(async (browser) => {
    //     const page = await browser.newPage();
    //     await page.goto(`https://twitter.com/${username}/status/${tweetID}`);
    //     await page.screenshot({ path: "./public/tweets/" + encodeURIComponent(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=1/users` + '.jpg')" });
    //     await browser.close();
    //   });
}
