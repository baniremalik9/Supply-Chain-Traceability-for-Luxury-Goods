;; Manufacturer Verification Contract
;; This contract validates legitimate producers of luxury goods

(define-data-var contract-owner principal tx-sender)

;; Map to store verified manufacturers
(define-map verified-manufacturers principal bool)

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ALREADY-VERIFIED (err u101))
(define-constant ERR-NOT-FOUND (err u102))

;; Check if caller is contract owner
(define-private (is-contract-owner)
  (is-eq tx-sender (var-get contract-owner))
)

;; Add a new manufacturer to the verified list
(define-public (add-manufacturer (manufacturer principal))
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (asserts! (is-none (map-get? verified-manufacturers manufacturer)) ERR-ALREADY-VERIFIED)
    (ok (map-set verified-manufacturers manufacturer true))
  )
)

;; Remove a manufacturer from the verified list
(define-public (remove-manufacturer (manufacturer principal))
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (asserts! (is-some (map-get? verified-manufacturers manufacturer)) ERR-NOT-FOUND)
    (ok (map-delete verified-manufacturers manufacturer))
  )
)

;; Check if a manufacturer is verified
(define-read-only (is-verified-manufacturer (manufacturer principal))
  (default-to false (map-get? verified-manufacturers manufacturer))
)

;; Transfer contract ownership
(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-contract-owner) ERR-NOT-AUTHORIZED)
    (ok (var-set contract-owner new-owner))
  )
)
