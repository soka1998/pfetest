import * as React from "react";
import axios from "axios";
import { FiCalendar } from "react-icons/fi"; // Import de l'icône de calendrier depuis react-icons
import { ThemeProvider } from "styled-components";

export default class RecentAnnouncements extends React.Component {
  
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      recentAnnouncements: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
    let deptId = JSON.parse(localStorage.getItem('user')).departmentId;
    // Fetch des annonces récentes pour le département spécifique
    axios({
      method: "get",
      url: `/api/departmentAnnouncements/recent/department/${deptId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      if (this._isMounted) {
        this.setState({ recentAnnouncements: res.data });
      }
    }).catch(error => {
      console.error("Error fetching recent announcements:", error);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const theme = {
      CalendarIcon: {
        textColor: "white", // couleur du texte de l'en-tête et du pied de page
        primaryColor: "#0da472", // couleur de fond de l'en-tête et du pied de page
        backgroundColor: "#fafafa"
      }
    };

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <div className="card">
        <div className="mt-1" style={{ textAlign: "center" }}></div>
        <ul>
          {this.state.recentAnnouncements.map((announcement) => (
            <li style={{ listStyle: "none"}} key={announcement.id} className="mb-2 mt-1">
              <div className="float-left mr-2">
                <time dateTime="2014-09-20" className="icon p-0">
                  <em>{days[new Date(announcement.createdAt).getDay()]}</em>
                  <strong>{monthNames[new Date(announcement.createdAt).getMonth()]}</strong>
                  <span>{new Date(announcement.createdAt).getDate()}</span>
                </time>
              </div>
              <span><strong>{announcement.announcementTitle}</strong></span>
              <br className="p-1"/>
              <small>{announcement.announcementDescription}</small>
              <hr className="pt-2 pb-1 mb-0"/>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
