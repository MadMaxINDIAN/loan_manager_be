const router = require('express').Router()
const ledgerController = require('../controllers/ledger')
const authMiddleware = require('../middleware/auth')

// URL: /ledger
// DESC create ledger
router.get('/', authMiddleware, ledgerController.createLedger)

// URL: /ledger/2
// DESC Create ledger 2
router.get('/2', authMiddleware, ledgerController.createLedger2)

module.exports = router