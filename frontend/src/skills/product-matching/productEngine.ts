import { Bid, MatchedProduct, ProductKeywordMapping } from '@/types'
import { mockProductKeywordMappings } from '@/mocks/data/products'

/**
 * Match a bid against product keyword mappings by scanning the bid summary and keywords.
 * Returns matched products with the AR info if bid is assigned.
 */
export function matchBidToProducts(
  bid: Bid,
  mappings: ProductKeywordMapping[] = mockProductKeywordMappings
): MatchedProduct[] {
  const results: MatchedProduct[] = []
  const summaryLower = bid.summary.toLowerCase()
  const bidKeywords = (bid.keywords || []).map(k => k.toLowerCase())

  for (const mapping of mappings) {
    const matched: string[] = []
    for (const kw of mapping.keywords) {
      const kwLower = kw.toLowerCase()
      if (
        summaryLower.includes(kwLower) ||
        bidKeywords.some(bk => bk.includes(kwLower) || kwLower.includes(bk))
      ) {
        matched.push(kw)
      }
    }
    if (matched.length > 0) {
      results.push({
        productName: mapping.productName,
        productManager: mapping.productManager,
        productManagerId: mapping.productManagerId,
        matchedKeywords: matched,
        arName: bid.assignedToUser?.name,
        arItcode: bid.assignedTo,
      })
    }
  }

  return results
}

/**
 * Filter bids to only include those matching products managed by a specific PM user.
 */
export function filterBidsForProductManager(
  bids: Bid[],
  pmUserId: string,
  mappings: ProductKeywordMapping[] = mockProductKeywordMappings
): Bid[] {
  const pmMappings = mappings.filter(m => m.productManagerId === pmUserId)
  if (pmMappings.length === 0) return []

  return bids.filter(bid => {
    const matches = matchBidToProducts(bid, pmMappings)
    return matches.length > 0
  })
}
