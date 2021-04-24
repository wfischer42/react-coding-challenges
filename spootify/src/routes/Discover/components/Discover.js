import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import api from "../../../config";

var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");
export default class Discover extends Component {
    totalNumberOfNewRelease;

  constructor() {
    super();

      this.totalNumberOfNewRelease = 0

      this.state = {
      totalRelease: 0,
      newReleases: [],
      playlists: [],
      categories: [],
      offset: 0
    };
      this.minusOffset = this.minusOffset.bind(this);
      this.plusOffset = this.plusOffset.bind(this);
  }

    minusOffset() {
        if(this.state.offset > 1 ) {
            this.setState((state,props)=>({
                offset: state.offset - 30
            }))
        }

    }
    plusOffset(){
          this.setState((state, props) => ({
              offset: state.offset + 30
          }))
    }

    componentDidUpdate(prevProps,prevState){
      if(prevState.offset !== this.state.offset) {
          fetch(api.authUrl, {
              method: "post",
              headers: new Headers({
                  'Authorization': 'Basic ' + btoa(api.clientId + ":" + api.clientSecret),
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              }),
              body: urlencoded
          }).then(res => res.json())
              .then(
                  (result) => {
                      // Fetch new release
                      fetch('https://api.spotify.com/v1/browse/new-releases?country=US&limit=30&offset=' + this.state.offset, {
                          method: "get",
                          headers: new Headers({
                              'Authorization': 'Bearer  ' + result["access_token"],
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',

                          }),
                      }).then(res => res.json())
                          .then(
                              (result) => {
                                  if(this.state.offset + 30 < result["albums"].total) {
                                      this.setState({newReleases: result["albums"].items})
                                  }
                              },
                              (error) => {
                                  console.log(error)
                              }
                          )
                  }
              )
      }
  }
    componentWillUnmount(){

    }
  //parallel request to the API
  componentDidMount(){

    fetch(api.authUrl,{
      method:"post",
      headers: new Headers({
        'Authorization': 'Basic ' + btoa(api.clientId+":"+api.clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }),
      body:urlencoded
    }) .then(res=>res.json())
        .then(
            (result) => {

                // Fetch new release
                fetch('https://api.spotify.com/v1/browse/new-releases?country=US&limit=30&offset='+this.state.offset,{
                    method:"get",
                    headers: new Headers({
                        'Authorization': 'Bearer  ' + result["access_token"],
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',

                    }),
                }).then(res => res.json())
                    .then(
                        (result) =>{

                            this.setState({newReleases:result["albums"].items})
                        },
                        (error) => {
                            console.log(error)
                        }
                    )


                //Fetch new playlist
                fetch('https://api.spotify.com/v1/users/MrDing/playlists?limit=30&offset=0',{
                    method:"get",
                    headers: new Headers({
                        'Authorization': 'Bearer  ' + result["access_token"],
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',

                    }),
                }).then(res => res.json())
                    .then(
                        (result) =>{
                            this.setState({playlists:result["items"]})
                        },
                        (error) => {
                            console.log(error)
                        }
                    )


                //Fetch new categories
                fetch('https://api.spotify.com/v1/browse/categories?offset=0&limit=10',{
                    method:"get",
                    headers: new Headers({
                        'Authorization': 'Bearer  ' + result["access_token"],
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',

                    }),
                }).then(res => res.json())
                    .then(
                        (result) =>{
                            this.setState({categories:result["categories"]["items"]})
                        },
                        (error) => {
                            console.log(error)
                        }
                    )

            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              console.log(error)
            }



        )


  }
  //Send request to /api/token to get access token
  //Use access token to request to
  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" imagesKey='images' data={newReleases} minusOffset ={this.minusOffset} plusOffset ={this.plusOffset}/>
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" imagesKey='images' data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" imagesKey="icons" data={categories} />
      </div>
    );
  }
}
