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

    componentDidUpdate(props) {
        // console.log("when");
        const gameWindow = document.querySelector(".game")
        // console.log(gameWindow.scrollTop && props.curPlatform > 2);
        if (gameWindow.scrollTop <= 100 && props.curPlatform > 2) {
            console.log(props);
            this.addPlatform(gameWindow);
        }
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

    addPlatform = (gameWindow) => {
        const prePlatforms = this.state.platforms;
        let idGenerator = this.state.currentPlatformId;
        idGenerator++;
        const newPlatform = <Platform xAxis={this.getRandomPos(81)} color={"blue"} key={idGenerator} idKey={idGenerator}/>
        console.log("added platform");
        
        prePlatforms.pop();
        prePlatforms.unshift(newPlatform);

        // const previousScrollTop = gameWindow.scrollTop;
        this.setState({platforms: prePlatforms, currentPlatformId: idGenerator});
        console.log(gameWindow.scrollTop);
        // console.log(gameWindow.scrollTop = previousScrollTop + 106);
        // console.log("does it reach here")
    }

    setGameAtBegining = () =>{
        document.addEventListener('DOMContentLoaded', () => {
            console.log("set twice?")
            const levelWindow = document.querySelector(".game")
            levelWindow.scrollTo(0, levelWindow.scrollHeight);     
        });

        document.addEventListener('click', () => {
            console.log("deu")  
            const levelWindow = document.querySelector(".game")
            this.addPlatform(levelWindow);

                    
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