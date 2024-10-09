import './Footer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faQuestionCircle, faMeteor } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

interface FooterParams {
    openPage: string;
    setOpenPage: React.Dispatch<React.SetStateAction<string>>;
}
export default function Footer({ openPage, setOpenPage }: FooterParams) {

    function toggleOpenPage() {
        if (openPage === "MeteorPage") {
            setOpenPage("AboutPage");
        } else if (openPage === "AboutPage") {
            setOpenPage("MeteorPage");
        }
    }



    return (
        <footer>
            <div className="footer-page-toggler">
                
                <FontAwesomeIcon icon={openPage === "MeteorPage" ? faQuestionCircle : faMeteor} className="toggler-icon" />
                <p onClick={toggleOpenPage} >
                    {openPage === "MeteorPage" && "À propos du projet"}
                    {openPage === "AboutPage" && "Retour à l'application"}
                </p>
            </div>
            <div className="footer-links">
                <a href="#">afieve.dev</a>
                <a href="https://github.com/afieve/meteor-song">
                    <FontAwesomeIcon icon={faGithub} className="icon"/>
                </a>
                <a href="#">
                    <FontAwesomeIcon icon={faLinkedin} className="icon"/>
                </a>
                <a href="#">
                    <FontAwesomeIcon icon={faLink} className="icon"/>
                </a>
            </div>
        </footer>
    )
}