import {twitterApi} from '../config/parameters'
var Twitter = require('twitter')
var client = new Twitter({
  consumer_key: twitterApi.consumerKey,
  consumer_secret: twitterApi.consumerSecret,
  access_token_key: twitterApi.accesToken,
  access_token_secret: twitterApi.accesTokenSecret
})

export async function findTweets (q){
  // client.get('favorites/list', function(error, tweets, response) {
  //   if(error) throw error;
  //   console.log(tweets);  // The favorites.
  //   console.log(response);  // Raw response object.
  // })
  return await client.get('search/tweets', {q}) // , function(error, tweets) {
//     if (!error){
//       console.log('----------------------------------------------')
//       console.log(tweets)
//     }
//  });
}
export async function trendsByPlace(id){
  
 return await client.get('trends/place', {id}) //, function(error, tweets){
//       var trend = new Promise(
//         function (reject) {
//           if(!error){
//             var trends = []
//             var i
//             for ( i = 0; i < tweets[0].trends.length; i ++){
//               trends.push(tweets[0].trends[i].name)
//             }
//             return trends
//           } else {
//             reject (false)
          
//         }
//         // console.log(trends + ' esto es el trend de twitter api')
//         console.log(trend + ' trends')
//         return trends
//       // console.log('llego hasta aki')
    
//  })
// })
}

