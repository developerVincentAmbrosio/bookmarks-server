const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const bookmarks = [
  {
    id: 0,
    title: 'Google',
    url: 'http://www.google.com',
    rating: '3',
    desc: 'Internet-related services and products.'
  },
  {
    id: 1,
    title: 'Thinkful',
    url: 'http://www.thinkful.com',
    rating: '5',
    desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
  },
  {
    id: 2,
    title: 'Github',
    url: 'http://www.github.com',
    rating: '4',
    desc: 'brings together the world\'s largest community of developers.'
  }
];

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
      res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    for (const field of ['title', 'url', 'rating']) {
        if (!req.body[field]) {
            logger.error(`${field} is required`)
            return res.status(400).send(`${field} is required`)
    }
  }

  const { title, url, description, rating } = req.body  

  const bookmark = { id: uuid(), title, url, description, rating }

  bookmarks.push(bookmark)

  logger.info(`Bookmark with id ${bookmark.id} created`)
  res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
    .json(bookmark)
})

bookmarksRouter
    .route('/bookmarks/:bookmark_id')
    .get((req, res) => {
    const { bookmark_id } = req.params;

    const bookmark = bookmarks.find(c => c.id == bookmark_id)
 
    if (!bookmark) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
 
    res.json(bookmark);
   })

  .delete((req, res) => {
    const { bookmark_id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(b => b.id == bookmark_id)
    
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }

    bookmarks.splice(bookmarkIndex, 1)
 
    logger.info(`Bookmark with id ${bookmark_id} deleted.`);
    res
      .status(204)
      .end(); 
  })

module.exports = bookmarksRouter