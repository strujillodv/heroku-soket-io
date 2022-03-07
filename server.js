
const path = require('path');
const express = require('express');
var cors = require('cors');
const app = express();
const { DateTime } = require("luxon");

const socketIO = require('socket.io');


const changes = []

let idSetTimeOut = 0;
const listSetTimeout = []

let hero = {
  type: 'hero',
  title: 'Hero Title',
  subtitle: 'Hero Subtitle',
  imgUrl: 'https://img.freepik.com/free-photo/colleagues-giving-fist-bump_53876-64857.jpg?w=826'
}

let banners = [
  {
    id: 0,
    link: '#',
    imgUrl: 'https://cdn.pixabay.com/photo/2016/05/27/08/51/mobile-phone-1419275_960_720.jpg'
  },
  {
    id: 1,
    link: '#',
    imgUrl: 'https://cdn.pixabay.com/photo/2018/07/28/11/08/guitar-3567767_960_720.jpg'
  }
]

let cards = [
  {
    id: 0,
    type: 'img',
    urlElement: 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849822_960_720.jpg',
    title: 'Title Card',
    subtitle: 'Subtitle Card'
  },
  {
    id: 1,
    type: 'img',
    urlElement: 'https://cdn.pixabay.com/photo/2015/01/09/11/09/meeting-594091_960_720.jpg',
    title: 'Title Card',
    subtitle: 'Subtitle Card'
  },
  {
    id: 2,
    type: 'img',
    urlElement: 'https://cdn.pixabay.com/photo/2015/01/08/18/11/laptops-593296_960_720.jpg',
    title: 'Title Card',
    subtitle: 'Subtitle Card'
  },
  {
    id: 3,
    type: 'img',
    urlElement: 'https://cdn.pixabay.com/photo/2020/03/06/08/00/laptop-4906312_960_720.jpg',
    title: 'Title Card',
    subtitle: 'Subtitle Card'
  },
  {
    id: 4,
    type: 'img',
    urlElement: 'https://cdn.pixabay.com/photo/2015/01/09/02/45/laptop-593673_960_720.jpg',
    title: 'Title Card',
    subtitle: 'Subtitle Card'
  },
  {
    id: 5,
    type: 'img',
    urlElement: 'https://cdn.pixabay.com/photo/2018/07/25/08/58/business-3560916_960_720.jpg',
    title: 'Title Card',
    subtitle: 'Subtitle Card'
  },
  {
    id: 6,
    type: 'img',
    urlElement: 'https://cdn.pixabay.com/photo/2018/01/19/07/57/shaking-hands-3091906_960_720.jpg',
    title: 'Title Card',
    subtitle: 'Subtitle Card'
  },
  {
    id: 7,
    type: 'img',
    urlElement: 'https://cdn.pixabay.com/photo/2022/01/18/16/49/town-6947538_960_720.jpg',
    title: 'Title Card',
    subtitle: 'Subtitle Card'
  },
  {
    id: 8,
    type: 'img',
    urlElement: 'https://cdn.pixabay.com/photo/2021/10/19/10/56/cat-6723256_960_720.jpg',
    title: 'Title Card',
    subtitle: 'Subtitle Card'
  }
]


// configuración del puerto del servidor
const port = process.env.PORT || 4040;


app.post('/webhooks/inbound', (req, res) => {
  console.log(req);

  res.status(200).end();
});

// Ruta a la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Usamos CORS
app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// Inicio del servidor
const server =  app.listen(port, () => {
    console.log(`Server on port ${port}`)
})

// Inicializamos sokets io con la configuracion del server
const io  = socketIO(server,
  {  cors: {    origin: '*',   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']  }
});

const dateMiliseconds = (time) => {

  const dateNow = DateTime.now().setZone("America/Bogota");
  const timeChange = DateTime.fromFormat(time, "hh:mm").setZone(
    "America/Bogota"
  ).plus({ Hours: 5 });

  const mls =  timeChange.diff(dateNow, "seconds")
    .toFormat("S")

  console.log("hora actual: " + dateNow.toISOTime())
  console.log("hora cambio: "+ timeChange.toISOTime())
  return mls
}

const sendBanner = (data) => {
  banners.forEach(banner => {
    if (banner.id === data.id -1 ) {
      banner.link = data.link
      banner.imgUrl = data.imgUrl
    }
  });
  io.emit('data:banner', banners);
  console.log("Data banner enviada a los clientes");

}

const sendCard = (data) => {
  cards.forEach(card => {
    if (card.id === data.id - 1) {
      card.type = data.type
      card.urlElement = data.urlElement
      card.title = data.title
      card.subtitle = data.subtitle
    }
  });
  io.emit('data:card', cards);
  console.log("Data cards enviada a los clientes");

}

io.on('connection', (socket) => {

  io.emit('data:page', {
    hero,
    banners,
    cards
  });

  console.log('Client connected');

  socket.on('disconnect', () => console.log('Client disconnected'));

  // Escucha los mensajes enviados por el canal de la aplicación
  socket.on('data:banner', (data) => {
    // Envia la data a los clientes conectados
    timeChange = data.timeChange
    listSetTimeout[idSetTimeOut+1] = setTimeout(() => {
      sendBanner(data)
    }, dateMiliseconds(timeChange))
  })

  socket.on('data:card', (data) => {
    timeChange = data.timeChange
    listSetTimeout[idSetTimeOut+1] = setTimeout(() => {
      sendCard(data)
    }, dateMiliseconds(timeChange))
  })

  socket.on('data:hero', (data) => {
    // Envia la data a los clientes conectados
    io.emit('data:hero', hero);
    console.log("Data card enviada a los clientes");
  })

});


setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
