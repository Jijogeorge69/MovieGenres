document.addEventListener("DOMContentLoaded", function () {
  let stars = document.querySelectorAll(".star");
  stars.forEach(function (star) {
    star.addEventListener("click", setRating);
  });

  let rating = parseInt(
    document.querySelector(".stars").getAttribute("data-rating")
  );
  let target = stars[rating - 1];
  target.dispatchEvent(new MouseEvent("click"));
});

function setRating(ev) {
  let span = ev.currentTarget;
  let stars = document.querySelectorAll(".star");
  let match = false;
  let num = 0;
  stars.forEach(function (star, index) {
    if (match) {
      star.classList.remove("rated");
    } else {
      star.classList.add("rated");
    }
    //are we currently looking at the span that was clicked
    if (star === span) {
      match = true;
      num = index + 1;
    }
  });
  document.querySelector(".stars").setAttribute("data-rating", num);
}

var API = (() => {
  var jwtToken;

  var login = () => {
    const val = document.getElementById("logintext").value;
    var login_msg = document.getElementById("login_success");

    if (val.trim().length == 0) {
      alert("Username can't be blank!!!");
      return false;
    } else if (val.trim().length < 4 || val.trim().length > 12) {
      alert("Username should be between 4 to 12 characters!!!");
      return false;
    }

    try {
      fetch("http://192.168.0.20:8080/api/v1/login", {
        method: "POST",
        body: JSON.stringify({
          username: val,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          jwtToken = data.token;

          document.getElementById("logintext").style.display = "none";
          document.getElementById("loginbtn").style.display = "none";
          document.getElementById("lg_username").style.display = "none";
          // document.getElementById("alertLoginSucess").style.display="block";
          login_msg.setAttribute("text-align", "center");
          login_msg.innerHTML = "Welcome " + val;
          // document.getElementById("alertLoginSucess").value="Welcome : -"+val;
        });
    } catch (e) {
      console.log(e);
      console.log("--------------------------------");
    }
    return false;
  };

  function saveChange(counter) {
    var rating = document.getElementById("rating" + counter);
    var lbl = document.getElementById("lbl" + counter);
    var getRating = rating.innerHTML;
    var getdbid = lbl.innerHTML;
    var trimdbID = getdbid.trim();
    var trimrating = getRating.trim();
    var getCountRating = trimrating.length;
    if (getCountRating == 0) {
      alert("Rating can't be blank!!!");
      return false;
    }
    if (getCountRating > 4) {
      alert("Rating can't be more than 4 stars!!!");
      return false;
    }
    if (!trimrating.startsWith("*") || !trimrating.endsWith("*")) {
      alert("Rating should contain only stars!!!");
      return false;
    }

    try {
      fetch("http://192.168.0.20:8080/api/v1/films", {
        method: "PATCH",
        body: JSON.stringify({
          id: trimdbID,
          rating: getCountRating
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      }).then((resp) => {
        setTimeout(function () {
          if (resp.status == 200) {
            alert("Rating: " + getCountRating + " got updated");
            return API.getFilm();
          } else {
            alert("Login Alert:-" + resp.status + " error.  Please Login");
          }
        });
      });
    } catch (e) {
      console.log(e);
      console.log("---------------------------------");
    }
    return false;
  }

  function deleteChange(counter) {
    var lbl = document.getElementById("lbl" + counter);

    var getdbid = lbl.innerHTML;
    var trimdbID = getdbid.trim();

    try {
      fetch("http://192.168.0.20:8080/api/v1/films", {
        method: "DELETE",
        body: JSON.stringify({
          id: trimdbID,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      }).then((resp) => {
        setTimeout(function () {
          if (resp.status == 200) {
           
            alert("Film deleted.");
            return API.getFilm();
         
          } else {
            alert("Login Alert:-" + resp.status + " error.  Please Login");
          }
        });
      });
    } catch (e) {
      console.log(e);
      console.log("---------------------------------");
    }
    return false;
  }

  var createFilm = () => {
    let starRating = parseInt(
      document.querySelector(".stars").getAttribute("data-rating")
    );

    $.ajax({
      url: "http://192.168.0.20:8080/api/v1/films",
      success: function (result) {},
      error: function (result) {
        alert("Server Down!!!!Your request could not be completed.");
      },
    });

    if (document.getElementById("text1").value.length == 0) {
      alert("Film Title can't be blank!!!");
      return false;
    } else if (starRating == 0) {
      alert("Rating can't be blank!!!");
      return false;
    } else {
      var getInput = document.getElementById("text1").value;

      try {
        fetch("http://192.168.0.20:8080/api/v1/films", {
          method: "POST",
          body: JSON.stringify({
            name: getInput,
            rating: starRating
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
          },
        }).then((resp) => {
          setTimeout(function () {
            if (resp.status == 200) {
              alert("Title: " + getInput + " got added");
              alert("Rating: " + starRating + " got added");
              document.getElementById("text1").value = "";
              
            } else {
              alert("Login Alert:-" + resp.status + " error.  Please Login");
            }
          });
        });
      } catch (e) {
        console.log(e);
        console.log("---------------------------------");
      }
      return false;
    }
  };

  var getFilm = () => {
    $.ajax({
      url: "http://192.168.0.20:8080/api/v1/films",
      success: function (result) {},
      error: function (result) {
        alert("Server Down!!!!Your request could not be completed.");
      },
    });

    var tableBody = document.getElementById("table-body");
    document.getElementById("table-body").innerHTML = "";
    var setCount = 1;

    try {
      fetch("http://192.168.0.20:8080/api/v1/films", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((results) => {
          if (results.length == 0) {
            var table = document.getElementById("tab1");
            table.setAttribute("style", "display: none;");
            alert("Oops! Looks like you don't have any data.");
          } else {
            results.forEach((data) => {
              let ratingCount = data.rating;
              var tr = document.createElement("tr");
              var td1 = document.createElement("td");
              var td2 = document.createElement("td");

              var btn = document.createElement("BUTTON");
              var deletebtn = document.createElement("BUTTON");

              var lbl = document.createElement("LABEL");
              btn.appendChild(document.createTextNode("Save"));
              btn.setAttribute("id", "save" + setCount);
              btn.setAttribute("class", "savebutton1");
              btn.setAttribute(
                "onclick",
                "return API.saveChange(" + setCount + ")"
              );

              deletebtn.appendChild(document.createTextNode("Delete"));
              deletebtn.setAttribute("id", "delete" + setCount);
              deletebtn.setAttribute("class", "deletebutton2");
              deletebtn.setAttribute(
                "onclick",
                "return API.deleteChange(" + setCount + ")"
              );

              td2.contentEditable = "true";
              td2.setAttribute("id", "rating" + setCount);
              lbl.setAttribute("id", "lbl" + setCount);
              lbl.innerHTML = data._id;
              lbl.style.display = "none";
              td1.innerHTML = data.name;
              if (ratingCount == 1) {
                td2.innerHTML = "*";
              } else if (ratingCount == 2) {
                td2.innerHTML = "**";
              } else if (ratingCount == 3) {
                td2.innerHTML = "***";
              } else if (ratingCount == 4) {
                td2.innerHTML = "****";
              } else if (ratingCount == 5) {
                td2.innerHTML = "*****";
              } else {
                td2.innerHTML = "Error";
              }
              // td3.innerHTML='<button class="btn btn-warning" onclick="Javascript:saveChanges(ratingCount,getid)">Save</button>'
              tr.appendChild(td1);
              tr.appendChild(td2);
              tr.appendChild(btn);
              tr.appendChild(deletebtn);
              tr.appendChild(lbl);
              tableBody.appendChild(tr);

              setCount = setCount + 1;
            });
            var table = document.getElementById("tab1");
            table.style = "block";
          }
        });
    } catch (e) {
      console.log(e);
      console.log("---------------------------------");
    }
    return false;
  };

  return {
    createFilm,
    getFilm,
    login,
    saveChange,
    deleteChange
  };
})();
