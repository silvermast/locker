<?php
namespace models;

use core;
use \Exception;

/**
 *
 * @author Jason Wright <jason@silvermast.io>
 * @since 1/5/17
 * @package charon
 */
class Locker extends core\Model {

    const TABLE = 'locker';

    public $id;
    public $accountId;
    public $name;
    public $items;
    public $note;

    /**
     * @throws Exception
     * @return self
     */
    public function validate(): self {
        $errors = [];

        if (empty($this->accountId))
            $errors[] = 'Invalid Account';

        if (mb_strlen($this->id) > 1024)
            $errors[] = 'Invalid ID';

        if (empty($this->name))
            $errors[] = 'Invalid Name';

        // 4MB max
        if (mb_strlen($this->note) > (4 * pow(2, 20)))
            $errors[] = 'Note string is too long.';

        if (is_array($this->items) && count($this->items) > 100)
            $errors[] = 'A Locker can only contain 100 items. Please create a new one.';

        if (count($errors))
            throw new Exception(implode("\n", $errors));

        return $this;
    }

}