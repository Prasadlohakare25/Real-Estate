import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';


const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-2">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
                {/* Logo */}
                <div className="mb-4 md:mb-0">
                    <h1 className="text-2xl font-bold"><span className='text-red-800'>Riyl</span> Estate</h1>
                </div>

                {/* Social Media Icons */}
                <div className="flex items-center mt-2 md:mt-0 text-xl gap-4">
                    <a href="https://www.linkedin.com/in/prasad-lohakare-a1a686249/" className="text-gray-300 hover:text-white mr-4">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://github.com/Prasadlohakare25" className="text-gray-300 hover:text-white mr-4">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://main--fanciful-cajeta-63592a.netlify.app/" className="text-gray-300 hover:text-white mr-4">
                        <i className="fas fa-folder-open"></i>
                    </a>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-2 text-center text-gray-300">
                <p>&copy; 2024 Riyl Estate. Made by <span className='font-bold text-xl'>Prasad Lohakare :)</span></p>
            </div>
        </footer>
    );
};

export default Footer;
