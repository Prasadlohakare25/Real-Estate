import React from 'react';

const About = () => {
  return (
    // <div className="bg-gray-100 min-h-screen py-12">
    //   <div className="container mx-auto px-4">
    //     <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-slate-800">
    //       <h2 className="text-3xl font-semibold mb-4">About Riyl Estate</h2>
    //       <p className="text-lg mb-4">
    //         Welcome to Riyl Estate, where we're revolutionizing the real estate experience with cutting-edge technology and unparalleled service. We've crafted a platform that seamlessly integrates sleek design with powerful functionality, ensuring that your journey towards finding the perfect property is not only efficient but also enjoyable.
    //       </p>
    //       <p className="text-lg mb-4">
    //         At Riyl Estate, we understand that your home is more than just a place to live—it's a reflection of your lifestyle, aspirations, and dreams. That's why we're committed to providing you with a personalized and immersive experience, guiding you every step of the way as you embark on this exciting journey.
    //       </p>
    //       <p className="text-lg mb-4">
    //         With our user-friendly interface and extensive database of listings, you'll have access to a diverse range of properties, from cozy apartments in bustling urban centers to luxurious estates nestled in serene landscapes. Whether you're a first-time buyer, seasoned investor, or simply looking for your next dream home, Riyl Estate has everything you need to make informed decisions and turn your real estate goals into reality.
    //       </p>
    //       <p className="text-lg mb-4">
    //         But we're more than just a platform—we're a team of passionate professionals dedicated to serving you with integrity, transparency, and expertise. From our experienced agents to our dedicated customer support team, we're here to listen to your needs, address your concerns, and provide you with the guidance and support you deserve.
    //       </p>
    //       <p className="text-lg mb-4">
    //         Join us at Riyl Estate and embark on a journey towards finding the home of your dreams. Your perfect property is just a click away.
    //       </p>
    //       <p className="text-lg mb-4">
    //         Welcome home.
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div
        className="bg-cover bg-center h-96 flex items-center justify-center"
        style={{ backgroundImage: `url('https://t3.ftcdn.net/jpg/06/99/29/14/240_F_699291445_0K5NBzUnJa6VPR9V9MNx8WXu9IUE62hB.jpg')` }}
      >
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Riyl Estate</h1>
          <p className="text-xl font-semibold text-white">Your journey to finding your dream home begins here.</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sleek Design</h2>
            <p className="text-lg">
              Our platform is designed with modern aesthetics and intuitive user experience in mind, ensuring a delightful browsing experience.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Comprehensive Listings</h2>
            <p className="text-lg">
              Explore a wide range of properties including apartments, houses, villas, and more, tailored to your preferences and needs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Expert Guidance</h2>
            <p className="text-lg">
              Our team of experienced professionals is here to assist you at every step of your real estate journey, ensuring personalized support and advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
