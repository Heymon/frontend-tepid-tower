import React from 'react';

import Platform from './Platform';

class PlatformContainer extends React.Component {

    state = {
        currentPlatformId: 0,
        platforms: [],
        numOfPlatforms: 10
    }

    componentDidMount() {
      this.generatePlatforms();
    }

    generatePlatforms = () => {

    const prePlatforms = [];
    let idGenerator = 0;
    for (let index = 0; index < this.state.numOfPlatforms; index++) {
        idGenerator++;
        prePlatforms.unshift(<Platform xAxis={this.getRandomPos(81)} color={"red"} key={idGenerator} idKey={"p" + idGenerator}/>)
        
    }
    console.log(prePlatforms);
    this.setState({platforms: prePlatforms, currentPlatformId: idGenerator})
    return this.state.platforms


    }

    getRandomPos = (max) => {
        console.log("radom");
        const randomNum = Math.floor(Math.random() * (max+1))
        console.log(randomNum);
        return Math.floor(Math.random() * (max+1))
    }


    render() {
        return (
            <>
            {this.state.platforms}
            </>
        )
    }
}

export default PlatformContainer;