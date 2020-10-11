import React from 'react';
import './index.scss';

export default function FooterComponent() {
    return (
        <>
        <div className="footer">
            <div className="cust-container">
                <h3>Follow Us</h3>
                <ul>
                    <li>
                        <a href="#">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fa fa-youtube" aria-hidden="true"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fa fa-linkedin" aria-hidden="true"></i>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="fa fa-google-plus" aria-hidden="true"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="copy-right">
            <p>&copy; 2020 Quzibily. Made with love.</p>
        </div>
        </>
    );
}
