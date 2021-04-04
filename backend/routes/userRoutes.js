import express from 'express'
import userCtrl from '../controllers/userControllers.js'
import protect from '../lib/authMiddleware.js'
const router = express.Router()

router.route('/').post(userCtrl.create).get(userCtrl.list)
router
  .route('/follow')
  .put(protect, userCtrl.addFollowing, userCtrl.addFollower)
router
  .route('/unfollow')
  .put(protect, userCtrl.removeFollowing, userCtrl.removeFollower)

router
  .route('/profile')
  .get(protect, userCtrl.getUserProfile)
  .put(protect, userCtrl.update)

router
  .route('/:id')
  .get(protect, userCtrl.read)

  .delete(protect, userCtrl.remove)

router.post('/login', userCtrl.authUser)

// router.param('id', userCtrl.userByID)

export default router
