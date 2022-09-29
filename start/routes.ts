/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/
import Route from '@ioc:Adonis/Core/Route'
import TweetsController from 'App/Controllers/Http/TweetsController'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

// Route.get('/dashboard', async ({ view }) => {
//   return view.render('dashboard')
// })

Route.get('/settings', async ({ view }) => {
  return view.render('settings')
})

Route.get('single-tweet', 'TweetsController.singleTweet')
Route.get('screenshot/:username', 'TweetsController.screenshot')
Route.get('screenshotSpecific/:url?', 'TweetsController.screenshotSpecific')


Route.get('app', 'TweetsController.app')

Route.get('tweets/:account?', 'TweetsController.tweets')

Route.get('dashboard', 'TweetsController.dashboard')
// Route.get('settings', 'TweetsController.settings')

// Route.post('dashboard', 'TweetsController.dashboard')
Route.get('register', 'AuthController.registerShow').as('auth.register.show')
Route.post('register', 'AuthController.register').as('auth.register') // ++

Route.post('addAccount', 'TweetsController.addAccount').as('tweet.accounts')
Route.get('deleteAccount/:accountName?', 'TweetsController.deleteAccount')

Route.get('login', 'AuthController.loginShow').as('auth.login.show')
Route.post('login', 'AuthController.login').as('auth.login')          // ++

Route.get('logout', 'AuthController.logout').as('auth.logout')        // ++