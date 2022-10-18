module.exports = {
  ppublic: [
    // {

    //     type: 'function',
    //     value: function(req,res,next){

    //         console.log(`This is the public middleware`)
    //         next()

    //     },

    // },

    {
      type: "function",
      value: function (req, res, next) {
        console.log("THE originalUrl: public 2");
        //console.log(req.originalUrl)
        next();
      },
    },
  ],

  pprivate: [
    // {

    //     type: 'function',
    //     value: function(req,res,next){

    //         console.log(`This is the PRIVATE middleware`)
    //         next()

    //     }

    // },

    {
      type: "function",
      value: function (req, res, next) {
        console.log("THE originalUrl: ANOTHER PRIVATE");
        console.log(req.originalUrl);
        next();
      },
    },
  ],

  all: [
    {
      type: "function",
      value: (req, res, next) => {
        console.log("I AM THE MIDDLEWARE THAT RUNS ON EVERY REQUEST");
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        // console.log(req)
        next();
      },
    },
  ],
};
