const Moralis = require('moralis/node')
const fs = require('fs')

// Moralis server
Moralis.start({
  serverUrl: 'https://dxzgmomfm2d8.usemoralis.com:2053/server',
  appID: 'Nfsvr5ggrpMgUeNNR9JdOcYMMLTibggVOy0lxGG3'
})

// This does not paginate, since all these projects are under pagination limits
// To paginate, pass `resp.cursor` to the next call
async function fetchByContract(address) {
  const options = { address, chain: "eth" };
  const resp = await Moralis.Web3API.token.getNFTOwners(options);
  return resp.result
}

async function main() {
  const acab = await fetchByContract('0xd455550af4a7558b0beec5eaec2cc415c4ff4039')
  const lgnd = await fetchByContract('0x807b7601aa00Ab306254e19c17aADC5c361354A4')
  const punish = await fetchByContract('0xe00D98151B43fA6f2B0888952A392CfC9Cf6Fc24')
  const nfts = [...acab, ...lgnd, ...punish]

  // Mapping owner counts
  const owners = {}
  nfts.forEach(r => {
    if (!owners[r.owner_of]) {
      owners[r.owner_of] = 0
    }
    owners[r.owner_of]++
  })

  // Write to file
  fs.writeFileSync('./out/owners.json', JSON.stringify(owners))
}

main()