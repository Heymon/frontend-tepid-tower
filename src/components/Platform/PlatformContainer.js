import React from 'react';

import Platform from './Platform';

class PlatformContainer extends React.Component {

    state = {
        currentPlatformId: 0,
        platforms: [],
        numOfPlatforms: 10
    }

    componentDidMount(props) {
        this.setGameAtBegining();
        this.generatePlatforms();
    }

    generatePlatforms = () => {

        const prePlatforms = [];
        let idGenerator = this.state.currentPlatformId;
        for (let index = 0; index < this.state.numOfPlatforms; index++) {
            idGenerator++;
            prePlatforms.unshift(<Platform xAxis={this.getRandomPos(81)} color={"red"} key={idGenerator} idKey={idGenerator}/>);
            
        }
        console.log(prePlatforms);
        this.setState({platforms: prePlatforms, currentPlatformId: idGenerator});
        return this.state.platforms

    }

    getRandomPos = (max) => {
        // const randomNum = Math.floor(Math.random() * (max+1));
        return Math.floor(Math.random() * (max+1))
    }

    setGameAtBegining = () =>{
        document.addEventListener('DOMContentLoaded', () => {
            // console.log("vaiiii")
            const levelWindow = document.querySelector(".game")
            levelWindow.scrollTo(0, levelWindow.scrollHeight);     
        });
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