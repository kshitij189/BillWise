import React from 'react'
import styles from './Home.module.css'

const Home = () => {
   
    return (
        <div className={styles.pageContainer}>
            
            <section className={styles.hero}>
                <h1 style={{ marginTop: '0px', position: 'relative', top: '-40px' }}>Easiest invoicing for freelancers and small businesses</h1>
                <div className={styles.paragraph}>
                   
                    <p style={{ marginTop: '10px', position: 'relative', top: '-40px' }}>Free and Open Source Invoicing application made with MongoDB, Express, React & Nodejs</p>
                </div>
                <div className={styles.imgContainer}>
                    <img src="https://res.cloudinary.com/dgltfenoq/image/upload/v1761240317/Invoice-front_akqs3a.png" alt="invoicing-app" style={{
                     maxWidth: '700px',
                     width: '100%',
                     height: 'auto',
                     display: 'block',
                     margin: '40px auto 0 auto' // Adds 40px space above the image
  }}/>
                </div>
            </section>
        </div>
    )
}

export default Home
