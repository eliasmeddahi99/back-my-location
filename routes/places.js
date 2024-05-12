var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');

const { checkBody } = require('../modules/checkBody');

const Marker = require('../models/markers')



// router.post('/', (req, res) => {
//    if (!checkBody(req.body, ['city', 'nickname'])) {
//      res.json({ result: false, error: 'Missing or empty fields' });
//      return;
//    }

//    const city_name= req.body.city
//    const nickname = req.body.nickname
//    console.log(city_name)

//    fetch(`https://api-adresse.data.gouv.fr/search/?q=${city_name}`)
//    .then((response) => response.json())
//    .then(data => 
//       {  
//          if(data){

//             const firstCity = data.features[0];


//          Marker.findOne({
//             nickname : nickname,
//             name: firstCity.properties.city,
//             latitude: firstCity.geometry.coordinates[1],
//             longitude: firstCity.geometry.coordinates[0],})
//             .then(check => {

//                if(check)
//                {res.json({result : false , message : "city already registered"})}
//                else
//                {
      
//                   const newMarker = new Marker ({
//                      nickname : nickname,
//                      city: firstCity.properties.city,
//                      latitude: firstCity.geometry.coordinates[1],
//                      longitude: firstCity.geometry.coordinates[0],
//                   })


//                   newMarker.save().then(newDoc => res.json({result : true, newMarker : newDoc}))

//                };

//             })
//          }

//          else {

//             res.json({result : false , message : "city not found"})

//          }
//       })
        
// })






/////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/', (req, res) => {
   if (!checkBody(req.body, ['nickname'])) {
           res.json({ result: false, error: 'Missing or empty fields' });
           return;
         }

   const city_name= req.body.city
   const nickname = req.body.nickname
   const longitude= req.body.longitude
   const latitude= req.body.latitude
   const myplace= req.body.myplace
  

   const addCity = async (city_name, nickname) => {
   //console.log(city_name)
   const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${city_name}`)
   // .then(response => response.json())
   const data = await response.json()
   //console.log("data await", data.features)

      if( data){

         
         const firstCity = data.features[0];
         console.log("firstCity", firstCity)

         const check = await Marker.findOne({nickname : nickname, name: firstCity.properties.city,
         latitude: firstCity.geometry.coordinates[1],
         longitude: firstCity.geometry.coordinates[0],})

         console.log("check", check)

         //console.log("check", check)
         

         if(check)
            {res.json({result : false , message : "city already registered"})}
            else
            {
   
               const newMarker = new Marker ({
                  nickname,
                  city: firstCity.properties.city,
                  latitude: firstCity.geometry.coordinates[1],
                  longitude: firstCity.geometry.coordinates[0],
               })

            
             res.json({result : true, newMarker : newMarker})


             newMarker.save().then()
            };

         }

         else {

            res.json({result : false , message : "city not found"})
   
         }
      }


   const addMyPLace = async () => {
   

         const newMarker = new Marker ({
            nickname,
            city: myplace,
            latitude,
            longitude,
         })
   
               
                 // res.json({result : true, newMarker : newMarker})
   
   
                  newMarker.save().then()

                  res.json({result : true, message : "place successfully added"})
      };
      
               
      if(city_name){
         addCity(city_name, nickname)
      }
      else if(longitude && latitude && myplace)
      {
         addMyPLace()
      }
      
   
})


//////////////////////////////////////////////








router.get('/:nickname', (req, res) => {

   const nickname = req.params.nickname

   Marker.find({nickname}).then(data => {
      console.log("dataaaaaaa",data)
    if (data.length > 0) {
      res.json({ result: true, places : data });
    } else {
      res.json({ result: false, error: 'this person not registered' });
    }
  });
});


router.delete('/', (req, res) => {

   const city_name= req.body.city
   const nickname = req.body.nickname

   Marker.deleteOne({nickname, city : city_name})
   .then(data => {
      console.log()
      if(data.deletedCount != 0){
         res.json({result : true, message : "city successfully deleted"})

      } else {
         res.json({result : false, message : "Impossible to find it "})
      }
   })

})



module.exports = router;
