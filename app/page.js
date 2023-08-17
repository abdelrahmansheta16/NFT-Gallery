"use client"; // This is a client component

import { useEffect, useState } from 'react'
import { NFTCard } from './components/nftCard';

const Home = () => {
  const api_key = "A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM"
  const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
  var requestOptions = {
    method: 'GET'
  };

  const [wallet, setWalletAddress] = useState();
  const [fetchURL, setFetchURL] = useState();
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([])
  const [pageKey, setPageKey] = useState()
  const [pageKeyURL, setPageKeyURL] = useState()
  const [fetchForCollection, setFetchForCollection] = useState(false)

  const fetchNFTs = async () => {
    console.log("fetching nfts");

    if (!collection.length) {
      setFetchURL(`${baseURL}?owner=${wallet}`);
    } else {
      console.log("fetching nfts for collection owned by address")
      setFetchURL(`${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`);
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      setFetchURL(`${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`);
    }
  }

  const loadMore = async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPageKeyURL(fetchURL + `&pageKey=${pageKey.slice(0, -2)}`)

  }

  useEffect(() => {
    const fetchData = async () => {
      console.log(fetchURL)
      console.log(pageKeyURL)
      try {
        if (fetchURL || pageKeyURL) {
          const response = pageKeyURL ? await fetch(pageKeyURL, requestOptions) : await fetch(fetchURL, requestOptions);
          const nfts = await response.json();
          if (nfts) {
            if (nfts.pageKey) {
              setPageKey(nfts.pageKey);
            } else setPageKey(null)
            fetchURL.includes("owner") ? setNFTs(nfts.ownedNfts) : setNFTs(nfts.nfts);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchURL, pageKeyURL]);


  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} onInput={(e) => { setWalletAddress(e.target.value) }} type={"text"} placeholder="Add your wallet address"></input>
        <input type={"text"} onChange={(e) => { setCollectionAddress(e.target.value) }} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e) => { setFetchForCollection(e.target.checked) }} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection()
            } else fetchNFTs()
          }
        }>Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map((nft, index) => {
            return (
              <NFTCard key={index} nft={nft}></NFTCard>
            )
          })
        }
      </div>
      <div>
        {pageKey ? <button onClick={loadMore}>Load More</button> : null}
      </div>
    </div>
  )
}

export default Home