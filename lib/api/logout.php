<?php
namespace api;

/**
 * Logout request route
 * @author Jason Wright <jason.dee.wright@gmail.com>
 * @since 1/3/17
 * @package charon
 */
class Logout extends Base {

    public function get() {
        unset($_SESSION);
        session_destroy();
        $this->send('Suggessfully logged out.', 401);
    }

}