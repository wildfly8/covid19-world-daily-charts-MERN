import React from 'react'
import HeaderBar from './HeaderBar'
// @ts-ignore
import styles from './App.module.css'


const Home = () => {
  return (
    <div className={styles.grid_container}>
      <header className={styles.grid_item_header}><HeaderBar /></header>
      <nav className={styles.grid_item_nav}><h4>Software Development Learning through examples:</h4> 1) MERN stack with React, Okta 
        <br/><br/> 2) MEAN stack with Angular <br/><br/> 3) Spring Boot with Java <br/><br/> 4) Kafka/Cassandra/Spark/Redis Pipeline
        <br/><h4>Academic Learning:</h4> 1) Math <br/><br/>2) Physics <br/><br/>3) Computer Science <br/><br/>3) Economics <br/><br/>4) Statistics
      </nav>
      <main className={styles.grid_item_content}>
        <div style={{ paddingLeft: "2em",  paddingRight: "2em"}}>
        <h4>About US:</h4>
		    <p>
            If you're a delicate observer of our daily life encounters, you'll find people are yearning for aquiring new knowledge and
            inspiration every single day, if not every single minute. Even though many people claim they're loving to teach
            and share their ideas to others, the truth is, ultimately they hope to learn some new valuable things from their
            actve interaction with others. No one enjoys repetitive work or life as another day passes without any new findings. This
            new knowledge really keeps people feel empowered. Thus this website portal is dedicated to people who realize 
            they'd better explore and learn new knowledge and skills in the area of Education &amp; Software Development. 
        </p>
        <p>
            However, any exploration and learning journey is not easy and need to overcome lots of this and that unfamiliar
            new challenges. Thus this website portal is focused to help dedicated people to overcome ALL the possible impediments
            on their road to the destination of truly aquiring new knowledge and inspiration. For every skillset a user choose, 
            we'll lead the user by several concrete examples or small projects. It's the shortest and fastest route to the destination. Just
            give it a try, right now, today...
        </p>
        <nav>
          <h4>Services provided:</h4>
			    <ul>
				    <li>			
					    <strong>
                Valuable educational content through K-12, college, and graduate levels.
              </strong>
				    </li>
            <br/>
            <li>
              <strong>
					      Individual-tailored education roadmap strategy discussion and implementation.
              </strong>
				    </li>
            <br/>
				    <li >
              <strong>
					      Software development projects from scratch, such as interactive website design using the most popular frameworks 
                and programming languages, modern big data batch analytics and stream processing pipelines, etc.
              </strong>
				    </li>
            <br/>
			    </ul>
		    </nav>
        <p>
			    <strong>Contact:</strong>
		    </p>
		    <address>
    		  <a href="mailto:#">WisdomSpringTech@yahoo.com</a>
		    </address>
        </div>	
      </main>
      <output className={styles.grid_item_infobar}></output>
      <footer className={styles.grid_item_footer}><small>Copyright &copy; Monad Wisdom Technologies. All rights reserved. If any suggestion, please email us at: wisdomspringtech@yahoo.com</small></footer> 
    </div>
  )
}
export default Home
