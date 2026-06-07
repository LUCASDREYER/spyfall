export interface Location {
  name: string;
  roles: string[];
}

export const LOCATIONS: Location[] = [
  { name: "Airplane", roles: ["Pilot", "Co-Pilot", "Flight Attendant", "Passenger", "Air Marshal", "First Class Passenger", "Mechanic"] },
  { name: "Bank", roles: ["Manager", "Guard", "Teller", "Robber", "Customer", "Loan Officer", "Armored Car Driver"] },
  { name: "Beach", roles: ["Lifeguard", "Tourist", "Surfer", "Ice Cream Vendor", "Volleyball Player", "Sunbather", "Swimmer"] },
  { name: "Casino", roles: ["Dealer", "Pit Boss", "Security Guard", "High Roller", "Cocktail Waitress", "Slot Player", "Cheater"] },
  { name: "Cathedral", roles: ["Priest", "Nun", "Parishioner", "Beggar", "Choir Member", "Organist", "Tourist"] },
  { name: "Circus", roles: ["Clown", "Acrobat", "Ringmaster", "Lion Tamer", "Magician", "Trapeze Artist", "Audience Member"] },
  { name: "Corporate Party", roles: ["CEO", "Manager", "Intern", "Accountant", "Secretary", "IT Guy", "HR Manager"] },
  { name: "Crusader Army", roles: ["Knight", "Squire", "Archer", "Medic", "Chaplain", "Foot Soldier", "Scout"] },
  { name: "Day Spa", roles: ["Masseuse", "Receptionist", "Customer", "Pedicurist", "Aromatherapist", "Manager", "Aesthetician"] },
  { name: "Embassy", roles: ["Ambassador", "Diplomat", "Guard", "Secretary", "Translator", "Visitor", "Spy"] },
  { name: "Hospital", roles: ["Doctor", "Nurse", "Patient", "Surgeon", "Anesthesiologist", "Janitor", "Visitor"] },
  { name: "Hotel", roles: ["Manager", "Bellhop", "Concierge", "Housekeeper", "Guest", "Chef", "Security Guard"] },
  { name: "Military Base", roles: ["General", "Colonel", "Private", "Sergeant", "Sniper", "Tank Operator", "Cook"] },
  { name: "Movie Studio", roles: ["Director", "Actor", "Producer", "Cameraman", "Makeup Artist", "Stuntman", "Script Supervisor"] },
  { name: "Ocean Liner", roles: ["Captain", "Crew Member", "Passenger", "Chef", "Entertainer", "Engineer", "Purser"] },
  { name: "Passenger Train", roles: ["Conductor", "Engineer", "Passenger", "Ticket Inspector", "Chef", "Cleaner", "Smuggler"] },
  { name: "Pirate Ship", roles: ["Captain", "First Mate", "Navigator", "Cook", "Lookout", "Gunner", "Captive"] },
  { name: "Polar Station", roles: ["Scientist", "Mechanic", "Meteorologist", "Doctor", "Cook", "Radio Operator", "Explorer"] },
  { name: "Police Station", roles: ["Chief", "Detective", "Officer", "Suspect", "Victim", "Lawyer", "Informant"] },
  { name: "Restaurant", roles: ["Chef", "Waiter", "Sommelier", "Hostess", "Busboy", "Customer", "Health Inspector"] },
  { name: "School", roles: ["Teacher", "Principal", "Student", "Janitor", "Librarian", "Counselor", "Lunch Lady"] },
  { name: "Service Station", roles: ["Manager", "Mechanic", "Cashier", "Customer", "Car Wash Attendant", "Tow Truck Driver", "Inspector"] },
  { name: "Space Station", roles: ["Commander", "Astronaut", "Scientist", "Engineer", "Doctor", "Pilot", "Tourist"] },
  { name: "Submarine", roles: ["Captain", "Navigator", "Sonar Operator", "Engineer", "Cook", "Torpedo Operator", "Medic"] },
  { name: "Supermarket", roles: ["Manager", "Cashier", "Stock Boy", "Customer", "Security Guard", "Butcher", "Baker"] },
  { name: "Theater", roles: ["Director", "Actor", "Stage Manager", "Costume Designer", "Audience Member", "Prompter", "Ticket Collector"] },
  { name: "University", roles: ["Professor", "Student", "Dean", "Janitor", "Librarian", "Security Guard", "Research Assistant"] },
];

export const DEFAULT_LOCATION_NAMES = LOCATIONS.map((l) => l.name);
