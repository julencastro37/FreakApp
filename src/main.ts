import * as isOnline  from 'is-online'
import {run} from './functions'
isOnline().then(online => {
    console.log("Conexión a internet-->" + online)
    run()
  })
  