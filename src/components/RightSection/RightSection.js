import React from 'react';
import './RightSection.css'


function RightSection() {
    return (

        <section className="section--right">
            {/* <h2>options</h2> */}
            <aside className="aside--top">
                <div>Settings</div>
                <div>Trophies</div>
                <div>Controls</div>
            </aside>
            <aside className="aside--bottom">
                <div>
                    user
                </div>
            </aside>
        </section>
            
    )
    
}

export default RightSection;