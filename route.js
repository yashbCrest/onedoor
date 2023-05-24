const express = require("express");
let axios = require("axios");
const router = express.Router();

axios = axios.create({
  timeout: 1000000,
  withCredentials: true,
});

// here we create our Route
router.post("/like", async (req, res) => {
  try {
    const { item_id, token, like } = req.body;
    console.log(req.body);
    const getUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/${item_id}`;
    const patchUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/${item_id}`;
    const putUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/publish`;
    const getByItems = axios
      .get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.items[0]) {
          let getLikes = response.data.items[0]["like-rich"]
            ? response.data.items[0]["like-rich"]
            : "";
          let splitArr = getLikes.split(",");
          //console.log("splitArr", splitArr);
          let exist = splitArr.includes(like);
          console.log("exist", exist);
          if (!exist) {
            let setLikes;
            if (getLikes == "") {
              setLikes = `${like}`;
            } else {
              setLikes = `${getLikes},${like}`;
            }
            const patchItem = axios
              .patch(
                patchUrl,
                { fields: { "like-rich": setLikes } },
                {
                  headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                //console.log(response.data);
                const publishItem = axios
                  .put(
                    putUrl,
                    { itemIds: [item_id] },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((response) => {
                    //console.log(response.data);
                    res.status(200).json({
                      message: "Like added",
                      count: splitArr.length,
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            let setLikes;
            let removeEle = getLikes.split(",");
            removeEle = removeEle.filter((item) => item !== like);
            setLikes = `${removeEle}`;
            console.log("remove", setLikes);
            const patchItem = axios
              .patch(
                patchUrl,
                { fields: { "like-rich": setLikes } },
                {
                  headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((response) => {
                const publishItem = axios
                  .put(
                    putUrl,
                    { itemIds: [item_id] },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((response) => {
                    res.status(200).json({
                      message: "Like removed",
                      count: removeEle.length,
                      response: response.data,
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else {
          console.log("no like");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (e) {
    console.log("err", e);
  }
});

router.get("/getlike", async (req, res) => {
  try {
    let getUrl;
    console.log("called", req.query);
    if (req.query.id) {
      getUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/${req.query.id}`;
    } else {
      getUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items`;
    }
    //const getUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/${req.query.id}`;
    const getByItems = axios
      .get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer cd7712b0dd440e3e129e000013789385651c521263662ef6bcff75978557dcd4`,
        },
      })
      .then((response) => {
        res.send(response.data.items);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (e) {
    console.log("err", e);
  }
});

router.post("/comment", async (req, res) => {
  try {
    const { item_id, token, comment } = req.body;
    console.log(req.body);
    const getUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/${item_id}`;
    const patchUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/${item_id}`;
    const putUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/publish`;
    const getByItems = axios
      .get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.items[0]) {
          let getComments = response.data.items[0]["user-comments"]
            ? response.data.items[0]["user-comments"]
            : "";
          let setCommets;
          if (getComments == "") {
            setCommets = JSON.stringify(req.body.comment);
          } else {
            let aa = JSON.stringify(req.body.comment);
            setCommets = getComments + "+" + aa;
          }
          console.log("setCommets", setCommets);
          const patchItem = axios
            .patch(
              patchUrl,
              { fields: { "user-comments": setCommets } },
              {
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              //console.log(response.data);
              const publishItem = axios
                .put(
                  putUrl,
                  { itemIds: [item_id] },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      authorization: `Bearer ${token}`,
                    },
                  }
                )
                .then((response) => {
                  console.log(response.data);
                  res.status(200).json({
                    message: "Comment added",
                    comment: setCommets,
                    //response: response,
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("no like");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (e) {
    console.log("err", e);
  }
});

router.get("/getcomment", async (req, res) => {
  try {
    let getUrl;
    console.log("called", req.query);
    if (req.query.id) {
      getUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/${req.query.id}`;
    } else {
      getUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items`;
    }
    //const getUrl = `http://api.webflow.com/collections/64538c3c2dd2b822db580e5f/items/${req.query.id}`;
    const getByItems = axios
      .get(getUrl, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer cd7712b0dd440e3e129e000013789385651c521263662ef6bcff75978557dcd4`,
        },
      })
      .then((response) => {
        res.send(response.data.items);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (e) {
    console.log("err", e);
  }
});

module.exports = router;
