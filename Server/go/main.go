package main

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"nhooyr.io/websocket"
)

func ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c, err := websocket.Accept(w, r, &websocket.AcceptOptions{InsecureSkipVerify: true})
	if err != nil {
		fmt.Printf("%v", err)
		return
	}
	defer c.Close(websocket.StatusInternalError, "the sky is falling")

	if c.Subprotocol() != "echo" {
		c.Close(websocket.StatusPolicyViolation, "client must speak the echo subprotocol")
		return
	}

	for {
		err = echo(r.Context(), c)
		if websocket.CloseStatus(err) == websocket.StatusNormalClosure {
			return
		}
		if err != nil {
			fmt.Printf("failed to echo with %v: %v", r.RemoteAddr, err)
			return
		}
	}
}

func echo(ctx context.Context, c *websocket.Conn) error {
	typ, r, err := c.Reader(ctx)
	if err != nil {
		return err
	}

	w, err := c.Writer(ctx, typ)
	if err != nil {
		return err
	}

	_, err = io.Copy(w, r)
	if err != nil {
		return fmt.Errorf("failed to io.Copy: %w", err)
	}

	err = w.Close()
	return err
}
