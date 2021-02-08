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
        prePlatforms.unshift(<Platform yAxis={37} color={"red"} key={idGenerator} idKey={"p" + idGenerator}/>)
        
    }
    console.log(prePlatforms);
    this.setState({platforms: prePlatforms, currentPlatformId: idGenerator})
    return this.state.platforms


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