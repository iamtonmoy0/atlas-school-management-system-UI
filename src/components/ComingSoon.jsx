import { Command } from "lucide-react";

function ComingSoon() { return <div className="coming-soon panel"><div className="coming-icon"><Command size={25}/></div><h2>Coming soon</h2><p>This module is part of the navigation blueprint and will be connected when its API endpoints are finalized.</p><button className="button button-secondary" onClick={()=>window.history.back()}>Go back</button></div>; }
export default ComingSoon;
