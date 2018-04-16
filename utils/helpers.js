var helpers = {

  vlmErr(str) {
    //return '{ "success":"false" , "err":"' + str + '" }';
    return { "success": false, "err": str };
  }
}

module.exports = helpers;