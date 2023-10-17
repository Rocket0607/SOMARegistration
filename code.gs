function random_assignment_country(attended) {
  var larger_countries = ["China", "Canada", "United States of America", "India", "United Kingdom"];
  var countries = [];
  // loop through rows (countries) to add them to the options list
  for (var i = 1; i <= 116; i++) {
    countries.push(SpreadsheetApp.getActiveSpreadsheet().getRange("A" + i.toString()).getValue());
  }
  if (attended) {
    return larger_countries[Math.floor(Math.random() * larger_countries.length)];
  } else {
    return countries[Math.floor(Math.random() * countries.length)];
  }
}

function is_space(committee) {
  return true;
}

// helper function for placing value in their appropriate spot
function place_value(country, committee, school) {
  const numRows = 116;
  // because of unicode
  const numCols = "L".charCodeAt(0);

  var country_row = 0;
  var committee_col = 0;

  // loop through rows (countries)
  for (var i = 1; i <= numRows; i++) {
    var value = SpreadsheetApp.getActiveSpreadsheet().getRange("A" + i.toString()).getValue();
    if (value == country) {
      country_row = i;
    }
  }
  // loop through columns
  for (let i = 66; i <= numCols; i++) {
    var value = SpreadsheetApp.getActiveSpreadsheet().getRange(String.fromCharCode(i) + "1").getValue();
    if (value == committee) {
      committee_col = i;
    }
  }
  if (country_row != 0 && committee_col != 0) {
    console.log("charcode: " + String.fromCharCode(committee_col) + country_row.toString());
    SpreadsheetApp.getActiveSpreadsheet().getRange(String.fromCharCode(committee_col) + country_row.toString()).setValue(school);
  } else {
    SpreadsheetApp.getActiveSpreadsheet().getRange("P1").setValue("error: school or committee not found");
  }
  
}

// run per school
function assign(school, attended, num_attendees) {
  school = "UTS";
  attended = true;
  num_attendees = 25;
  var preferences = ["GA1", "GA2"];
  var committees = [];
  // putting all committee options in a list
  for (var i = 65; i <= "L".charCodeAt(0); i++) {
    committees.push(SpreadsheetApp.getActiveSpreadsheet().getRange(String.fromCharCode(i) + "1").getValue());
  }
  var count = {};
  for (var i = 0; i < committees.length; i++) {
    count[committees[i]] = 0;
  }
  var assignments = [];
  for(var i = 0; i < num_attendees; i++) {
    if (i < preferences.length) {
      if (is_space(preferences[i])) {
          assignments.push(
            {
              "country": random_assignment_country(attended),
              "committee": preferences[i],
            }
          );
          count[preferences[i]] += 1;
      }
    } else {
      while (true) {
        var rand_choice = Math.floor(Math.random() * committees.length);
        if (count[committees[rand_choice]] < 3) {
          assignments.push(
            {
              "country": random_assignment_country(attended),
              "committee": committees[rand_choice],
            }
          );
          count[committees[rand_choice]] += 1;
          break;
        }
      }
      
    }

  }
  console.log(assignments);
  console.log(count);
  for (var i = 0; i < assignments.length; i++) {
    place_value(assignments[i]["country"], assignments[i]["committee"], school);
  }
}
