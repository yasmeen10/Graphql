import React, { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";

const CREATE_COMMENT = gql`
  mutation createNewComment($input: CommentInput!) {
    createComment(input: $input) {
      name
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($postId: Int!) {
    deletePost(input: { postId: $postId })
  }
`;

export default function PostCard(props) {
  const [image, setImage] = useState("");
  const [comment, setComment] = useState(null);

  const generateImage = async () => {
    const res = await fetch("https://picsum.photos/800/400");
    setImage(res.url);
  };

  useEffect(() => {
    generateImage();
  }, []);

  const [mutate, { data }] = useMutation(CREATE_COMMENT);
  const [mutateDel] = useMutation(DELETE_POST);

  function handleCommentChange(event) {
    setComment(event.target.value);
  }

  async function handleDelete() {
    await mutateDel({
      variables: {
        postId: props.postId,
      },
    });
    await props.refetch();
  }

  async function submitComment() {
    if (!comment) return;

    await mutate({
      variables: {
        input: {
          postId: props.postId,
          name: comment,
        },
      },
    });

    await props.refetch();

    setComment(null);
    console.log(data);
  }

  return (
    <>
      <div className="mt-4 ml-4 max-w-sm rounded overflow-hidden shadow-lg border-2 border-gray-300">
        <img className="w-full" src={image} alt="{props.title}" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{props.title}</div>
          <p className="text-gray-700 text-base">{props.body}</p>
        </div>
        <button
          onClick={handleDelete}
          className="bg-red-500 p-2 rounded text-white hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Delete
        </button>
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            comments
          </span>
          {props.comments.map((comment) => (
            <li key={comment.id}>{comment.name}</li>
          ))}
          <input
            className="border-2 border-gray-300 rounded py-2 px-4 w-full"
            placeholder="Write comment "
            onChange={handleCommentChange}
          />
          <button
            onClick={submitComment}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:bg-blue-700"
          >
            Add Comment
          </button>
        </div>
      </div>
    </>
  );
}
