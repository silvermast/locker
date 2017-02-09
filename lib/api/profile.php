<?php
namespace api;

use core;
use models;
use \Exception;
use \stdClass;

/**
 * /profile API path
 * @author Jason Wright <jason@silvermast.io>
 * @since 1/3/17
 * @package charon
 */
class Profile extends Base {

    protected $is_encrypted = true;

    /**
     * GET /profile
     * Reads the authenticated user's profile
     */
    public function get() {
        if (!$this->is_json) {
            require(HTML . '/profile.php');
            die();

        } else {
            // load the locker data object
            $this->send(models\User::me());

        }
    }

    /**
     * POST /profile
     * Saves the user's profile information
     * @throws Exception
     */
    public function post() {
        if (!$this->data instanceof stdClass)
            throw new Exception('Invalid Request Object', 400);

        unset($this->data->id); // avoid spoofing user id

        $user = models\User::me();
        $user->setVars($this->data);

        if (!empty($this->data->changePass1)) {
            if ($this->data->changePass1 !== $this->data->changePass2)
                throw new Exception('Passwords do not match', 400);
            else
                $user->setPasswordHash($this->data->changePass1);
        }

        $user->validate()->save();

        $this->send($user);
    }

}